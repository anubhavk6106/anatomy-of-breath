import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import schemas from './schemas/index'

// Read project ID from environment or use placeholder
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id'
const dataset   = process.env.SANITY_STUDIO_DATASET    || 'production'

export default defineConfig({
  name: 'anatomia-del-aliento',
  title: 'Anatomía del Aliento — Studio',

  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenido / Content')
          .items([
            // ── Blog Posts ──────────────────────────────────────
            S.listItem()
              .title('📝 Blog Posts — Medicina de la Voz')
              .child(
                S.documentList()
                  .title('Blog Posts')
                  .filter('_type == "post"')
                  .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
              ),

            S.divider(),

            // ── Events / Workshops ──────────────────────────────
            S.listItem()
              .title('🗓 Events & Workshops — Experiences')
              .child(
                S.documentList()
                  .title('Events')
                  .filter('_type == "event"')
                  .defaultOrdering([{ field: 'date', direction: 'asc' }])
              ),

            S.divider(),

            // ── Soma Features ───────────────────────────────────
            S.listItem()
              .title('✨ Soma Featured Content')
              .child(
                S.documentList()
                  .title('Soma Features')
                  .filter('_type == "somaFeature"')
              ),
          ]),
    }),

    // GROQ query playground — useful for debugging
    visionTool(),
  ],

  schema: {
    types: schemas,
  },
})
