import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  timestamp,
  boolean,
  jsonb,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ─── ADMIN USERS ─────────────────────────────────────────────
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── SITE SETTINGS (hero, contact, CV) ───────────────────────
export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id),
  heroName: varchar('hero_name', { length: 255 }).notNull(),
  heroRole: text('hero_role').notNull(),
  contactLocation: varchar('contact_location', { length: 255 }),
  contactPhone: varchar('contact_phone', { length: 50 }),
  contactEmail: varchar('contact_email', { length: 255 }),
  cvFileUrl: text('cv_file_url'),
  profileImageUrl: text('profile_image_url'),
  heroStat1Value: varchar('hero_stat1_value', { length: 50 }),
  heroStat1Label: varchar('hero_stat1_label', { length: 100 }),
  heroStat2Value: varchar('hero_stat2_value', { length: 50 }),
  heroStat2Label: varchar('hero_stat2_label', { length: 100 }),
  socialGithub: varchar('social_github', { length: 255 }),
  socialLinkedin: varchar('social_linkedin', { length: 255 }),
  socialInstagram: varchar('social_instagram', { length: 255 }),
  socialTwitter: varchar('social_twitter', { length: 255 }),
  socialWhatsapp: varchar('social_whatsapp', { length: 255 }),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ─── PROFESSIONAL SUMMARY ────────────────────────────────────
export const professionalSummary = pgTable('professional_summary', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id),
  content: text('content').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ─── SKILL CATEGORIES & SKILLS ───────────────────────────────
export const skillCategories = pgTable('skill_categories', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id),
  name: varchar('name', { length: 255 }).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
});

export const skills = pgTable('skills', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id')
    .references(() => skillCategories.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
});

// ─── COMPANIES & EXPERIENCES ─────────────────────────────────
export const companies = pgTable('companies', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id),
  name: varchar('name', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }),
  sortOrder: integer('sort_order').default(0).notNull(),
});

export const experiences = pgTable('experiences', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id),
  companyId: integer('company_id')
    .references(() => companies.id, { onDelete: 'cascade' })
    .notNull(),
  jobTitle: varchar('job_title', { length: 255 }).notNull(),
  period: varchar('period', { length: 100 }).notNull(),
  description: text('description'),
  sortOrder: integer('sort_order').default(0).notNull(),
});

export const experienceBullets = pgTable('experience_bullets', {
  id: serial('id').primaryKey(),
  experienceId: integer('experience_id')
    .references(() => experiences.id, { onDelete: 'cascade' })
    .notNull(),
  content: text('content').notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
});

// ─── EDUCATION ───────────────────────────────────────────────
export const education = pgTable('education', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id),
  institution: varchar('institution', { length: 255 }).notNull(),
  major: varchar('major', { length: 255 }),
  location: varchar('location', { length: 255 }),
  period: varchar('period', { length: 100 }).notNull(),
  notes: text('notes'),
  sortOrder: integer('sort_order').default(0).notNull(),
});

// ─── PROJECTS ────────────────────────────────────────────────
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  techStack: text('tech_stack'), // comma-separated or JSON
  imageUrl: text('image_url'),
  imageUrls: jsonb('image_urls').$type<string[]>().default([]),
  projectUrl: text('project_url'),
  repoUrl: text('repo_url'),
  featured: boolean('featured').default(false).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── CONTACT MESSAGES ────────────────────────────────────────
export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ═══ RELATIONS ═══════════════════════════════════════════════

export const skillCategoriesRelations = relations(
  skillCategories,
  ({ many }) => ({
    skills: many(skills),
  }),
);

export const skillsRelations = relations(skills, ({ one }) => ({
  category: one(skillCategories, {
    fields: [skills.categoryId],
    references: [skillCategories.id],
  }),
}));

export const companiesRelations = relations(companies, ({ many }) => ({
  experiences: many(experiences),
}));

export const experiencesRelations = relations(
  experiences,
  ({ one, many }) => ({
    company: one(companies, {
      fields: [experiences.companyId],
      references: [companies.id],
    }),
    bullets: many(experienceBullets),
  }),
);

export const experienceBulletsRelations = relations(
  experienceBullets,
  ({ one }) => ({
    experience: one(experiences, {
      fields: [experienceBullets.experienceId],
      references: [experiences.id],
    }),
  }),
);
export const user = pgTable("user", {
					id: text("id").primaryKey(),
					username: text('username').unique(),
					name: text('name').notNull(),
					email: text('email').notNull().unique(),
					emailVerified: boolean('email_verified').notNull(),
					image: text('image'),
					createdAt: timestamp('created_at').notNull(),
					updatedAt: timestamp('updated_at').notNull()
				});

export const session = pgTable("session", {
					id: text("id").primaryKey(),
					expiresAt: timestamp('expires_at').notNull(),
					token: text('token').notNull().unique(),
					createdAt: timestamp('created_at').notNull(),
					updatedAt: timestamp('updated_at').notNull(),
					ipAddress: text('ip_address'),
					userAgent: text('user_agent'),
					userId: text('user_id').notNull().references(()=> user.id)
				});

export const account = pgTable("account", {
					id: text("id").primaryKey(),
					accountId: text('account_id').notNull(),
					providerId: text('provider_id').notNull(),
					userId: text('user_id').notNull().references(()=> user.id),
					accessToken: text('access_token'),
					refreshToken: text('refresh_token'),
					idToken: text('id_token'),
					accessTokenExpiresAt: timestamp('access_token_expires_at'),
					refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
					scope: text('scope'),
					password: text('password'),
					createdAt: timestamp('created_at').notNull(),
					updatedAt: timestamp('updated_at').notNull()
				});

export const verification = pgTable("verification", {
					id: text("id").primaryKey(),
					identifier: text('identifier').notNull(),
					value: text('value').notNull(),
					expiresAt: timestamp('expires_at').notNull(),
					createdAt: timestamp('created_at'),
					updatedAt: timestamp('updated_at')
				});
