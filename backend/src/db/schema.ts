import { pgTable, uuid, text, timestamp, pgEnum, varchar} from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['user', 'assistant', 'system']);

export const studyMaterialTypeEnum = pgEnum('type', ['YTLink', 'webpageLink', 'pdf', 'image']);

export const processedStatusEnum = pgEnum('processed_status', ['pending', 'processing', 'completed', 'failed']);

export const user = pgTable('user', {
    id: uuid('id').primaryKey().defaultRandom(),
    username: text('username').notNull(),
    email: text('email').notNull().unique(),
    password_hash: text('password_hash').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  }); 

  export const userDetails = pgTable('user_details', {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid('user_id').notNull().references(() => user.id).unique(),
    course: text('course').notNull(),
    branch: text('branch').notNull(),
    year: varchar('year').notNull(),
    learning_goals: text('learning_goals'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  });


  export const frame = pgTable('frame', {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid('user_id').notNull().references(() => user.id),
    title: text('title').notNull(),
    description: text('description'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  });


  export const massage = pgTable('massage', {
    id: uuid('id').primaryKey().defaultRandom(),
    frame_id: uuid('frame_id').notNull().references(() => frame.id),
    user_id: uuid('user_id').notNull().references(() => user.id),
    role: roleEnum('role').notNull(),
    content: text('content').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  });

  export const study_material = pgTable('study_material', {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid('user_id').notNull().references(() => user.id),
    frame_id: uuid('frame_id').notNull().references(() => frame.id),
    title: text('title').notNull(),
    type: studyMaterialTypeEnum('type').notNull(),
    url: text('url').notNull(),
    imagekit_id: varchar('imagekit_id'),
    processed_status: processedStatusEnum('processed_status').notNull().default('pending'),
    ai_generated_summary: text('ai_generated_summary'),
    embeddings: varchar('embeddings').$type<any>(), // Store as JSON string or array depending on your ORM support
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  });