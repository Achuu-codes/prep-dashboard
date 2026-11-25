CREATE TABLE `items` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text DEFAULT 'problem' NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`url` text,
	`external_id` text,
	`difficulty` text,
	`rating` real,
	`is_paid_only` integer DEFAULT false NOT NULL,
	`validated_at` integer,
	`meta` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `items_kind_slug_idx` ON `items` (`kind`,`slug`);--> statement-breakpoint
CREATE INDEX `items_difficulty_idx` ON `items` (`difficulty`);--> statement-breakpoint
CREATE INDEX `items_rating_idx` ON `items` (`rating`);--> statement-breakpoint
CREATE TABLE `kv` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `lc_submissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title_slug` text NOT NULL,
	`title` text,
	`submitted_at` integer,
	`source` text NOT NULL,
	`seen_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `lc_sub_unique_idx` ON `lc_submissions` (`title_slug`,`submitted_at`,`source`);--> statement-breakpoint
CREATE INDEX `lc_sub_slug_idx` ON `lc_submissions` (`title_slug`);--> statement-breakpoint
CREATE TABLE `placements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`topic_id` text NOT NULL,
	`item_id` text NOT NULL,
	`sub_pattern` text,
	`order_index` integer DEFAULT 0 NOT NULL,
	`note` text,
	FOREIGN KEY (`topic_id`) REFERENCES `topics`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `placements_topic_item_idx` ON `placements` (`topic_id`,`item_id`);--> statement-breakpoint
CREATE INDEX `placements_topic_idx` ON `placements` (`topic_id`,`order_index`);--> statement-breakpoint
CREATE INDEX `placements_item_idx` ON `placements` (`item_id`);--> statement-breakpoint
CREATE TABLE `progress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`item_id` text NOT NULL,
	`status` text DEFAULT 'todo' NOT NULL,
	`solved_at` integer,
	`time_taken_min` integer,
	`without_hints` integer,
	`notes` text,
	`attempts` integer DEFAULT 0 NOT NULL,
	`review_stage` integer DEFAULT 0 NOT NULL,
	`last_reviewed_at` integer,
	`next_review_at` integer,
	`auto_marked` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `progress_item_idx` ON `progress` (`item_id`);--> statement-breakpoint
CREATE INDEX `progress_status_idx` ON `progress` (`status`);--> statement-breakpoint
CREATE INDEX `progress_next_review_idx` ON `progress` (`next_review_at`);--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`item_id` text NOT NULL,
	`stage` integer NOT NULL,
	`due_at` integer NOT NULL,
	`completed_at` integer,
	`outcome` text,
	FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `reviews_due_idx` ON `reviews` (`due_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `reviews_item_stage_idx` ON `reviews` (`item_id`,`stage`);--> statement-breakpoint
CREATE TABLE `sections` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`kind` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'soon' NOT NULL,
	`order_index` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sections_slug_idx` ON `sections` (`slug`);--> statement-breakpoint
CREATE TABLE `snapshots` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`provider` text NOT NULL,
	`kind` text NOT NULL,
	`fetched_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`ok` integer DEFAULT true NOT NULL,
	`payload` text,
	`error` text
);
--> statement-breakpoint
CREATE INDEX `snapshots_lookup_idx` ON `snapshots` (`provider`,`kind`,`fetched_at`);--> statement-breakpoint
CREATE INDEX `snapshots_ok_idx` ON `snapshots` (`provider`,`kind`,`ok`,`fetched_at`);--> statement-breakpoint
CREATE TABLE `sync_runs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`provider` text NOT NULL,
	`trigger` text NOT NULL,
	`started_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`finished_at` integer,
	`status` text NOT NULL,
	`message` text,
	`items_auto_marked` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `sync_runs_provider_idx` ON `sync_runs` (`provider`,`started_at`);--> statement-breakpoint
CREATE TABLE `topics` (
	`id` text PRIMARY KEY NOT NULL,
	`section_id` text NOT NULL,
	`parent_topic_id` text,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`summary` text,
	`note_slug` text,
	`order_index` integer DEFAULT 0 NOT NULL,
	`meta` text,
	FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `topics_section_slug_idx` ON `topics` (`section_id`,`slug`);--> statement-breakpoint
CREATE INDEX `topics_parent_idx` ON `topics` (`parent_topic_id`);