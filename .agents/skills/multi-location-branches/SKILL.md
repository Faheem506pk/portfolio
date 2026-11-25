---
name: multi-location-branches
description: Standards and database RPC patterns for managing multi-location branches, per-branch menus, operational isolation, and cross-branch sync.
---

# Multi-Location & Branch Architecture Guide

Use this skill whenever working on multi-branch features, location selector UI, per-branch menu overrides, opening hours sync, or location-scoped operational data (orders, staff, printers, delivery zones).

## Core Architecture Invariants

1. **Branch Representation**:
   - Every physical location is stored in `public.locations` (`id`, `tenant_id`, `name`, `address_line1`, `city`, `postcode`, `phone`, `is_primary`, `is_active`).
   - Every tenant has exactly **one primary location** (`is_primary = true`), enforced by unique index `locations_one_primary_per_tenant`.
   - Branches share the parent tenant's brand, domain, and subscription plan, but maintain isolated operational data.

2. **Menu Ownership & Fallback Model**:
   - `location_id IS NULL` = **Shared Tenant-Wide Default Menu** (counts toward `max_menu_items` plan limit).
   - `location_id = 'loc-uuid'` = **Branch-Owned Menu Override** (does NOT consume extra plan quota).
   - Query pattern: Branch views use local rows if present; otherwise fall back to `location_id IS NULL` rows.

3. **Operational Data Isolation Matrix**:
   - `orders.location_id`: Strictly isolated per branch KDS/order board.
   - `staff_members.location_id`: Assigned per branch location.
   - `print_printers.location_id`: Mapped to hardware at physical branch.
   - `delivery_zones.location_id`: Scoped fees, postcodes, and minimum order values per branch.
   - `opening_hours.location_id`: Scoped opening schedules per branch.
   - `tenant_service_configs_location_overrides`: Scoped pickup/delivery/dine-in toggles.
   - `tenant_payment_methods_location_overrides`: Scoped cash/card toggles.

4. **Manual On-Demand Cross-Branch Synchronization (NEVER Automatic)**:
   - Syncing across branches is **STRICTLY MANUAL ON-DEMAND** (explicit owner action). Edits made at Branch A or Tenant Default NEVER automatically mutate or overwrite Branch B.
   - The owner manually triggers sync when needed for specific items, categories, hours, or settings via dedicated RPCs:
     - `sync_location_menu(tenant_id, source_location_id, dest_location_id, scope, scope_id)` — Supports `scope` values `'full'`, `'category'`, or `'item'`.
     - `sync_location_opening_hours(tenant_id, dest_location_id, source_location_id)`
     - `sync_location_service_config(tenant_id, dest_location_id, source_location_id)`
     - `sync_location_payment_methods(tenant_id, dest_location_id, source_location_id)`
     - `sync_location_delivery_zones(tenant_id, dest_location_id, source_location_id)`
   - **Lineage & Independence**: Menu copies populate `synced_from_item_id` and `synced_from_category_id` to preserve historical analytics continuity while allowing Branch B to maintain full independent pricing and availability.

