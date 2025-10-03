import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const providerSelection = () =>
  v.object({
    type: v.string(),
    settings: v.optional(v.any()),
  });

export default defineSchema({
  households: defineTable({
    name: v.string(),
    createdAt: v.number(),
  }),

  providerConfigs: defineTable({
    scope: v.union(v.literal('global'), v.literal('household')),
    householdId: v.optional(v.id('households')),
    marketData: providerSelection(),
    trading: providerSelection(),
    banking: providerSelection(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_scope', ['scope'])
    .index('by_household', ['householdId']),
});
