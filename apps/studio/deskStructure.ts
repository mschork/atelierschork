// deskStructure.ts
import type {StructureResolver} from 'sanity/structure'
import {
  BsPalette,
  BsBuilding,
  BsPerson,
  BsGeoAlt,
  BsDroplet,
  BsBrush,
  BsFolder,
  BsGeoFill,
  BsTag,
  BsPersonBadge,
  BsCollection,
  BsTrophy,
  BsGear,
  BsGrid
} from 'react-icons/bs'

const deskStructure: StructureResolver = async (S, context) => {
  // Fetch all project types to create dynamic list items
  const projectTypes = await context
    .getClient({apiVersion: '2024-01-01'})
    .fetch(`*[_type == "projectType"] | order(title asc) {_id, title, icon}`)

  return S.list()
    .title('Content')
    .items([
      // Work Section
      //S.divider().title('Work'),
      S.listItem()
        .title('Projects')
        .icon(BsCollection)
        .child(S.documentTypeList('project').title('Projects')),

      // Dynamically create list items for each project type (no icons for visual hierarchy)
      ...projectTypes.map((type: {_id: string; title: string; icon?: string}) =>
        S.listItem()
          .title(type.title)
          .child(
            S.documentList()
              .apiVersion('2024-01-01')
              .title(`${type.title} Projects`)
              .schemaType('project')
              .filter('_type == "project" && projectType._ref == $typeId')
              .params({typeId: type._id})
          )
      ),

      S.listItem()
        .title('Artworks')
        .icon(BsPalette)
        .child(S.documentTypeList('artwork').title('Artworks')),
      S.listItem()
        .title('Exhibitions')
        .icon(BsBuilding)
        .child(S.documentTypeList('exhibition').title('Exhibitions')),
      S.listItem()
        .title('Awards')
        .icon(BsTrophy)
        .child(S.documentTypeList('award').title('Awards')),

      // People Section
      S.divider().title('People'),
      S.listItem()
        .title('People')
        .icon(BsPerson)
        .child(S.documentTypeList('person').title('People')),
      S.listItem()
        .title('Roles')
        .icon(BsPersonBadge)
        .child(S.documentTypeList('role').title('Roles')),

      // Taxonomies Section
      S.divider().title('Taxonomies'),
      S.listItem()
        .title('Media Types')
        .icon(BsDroplet)
        .child(S.documentTypeList('mediaType').title('Media Types')),
      S.listItem()
        .title('Techniques')
        .icon(BsBrush)
        .child(S.documentTypeList('technique').title('Techniques')),
      S.listItem()
        .title('Tags')
        .icon(BsTag)
        .child(S.documentTypeList('tag').title('Tags')),
      S.listItem()
        .title('Categories')
        .icon(BsFolder)
        .child(S.documentTypeList('category').title('Categories')),
      S.listItem()
        .title('Project Types')
        .icon(BsGrid)
        .child(S.documentTypeList('projectType').title('Project Types')),
      S.listItem()
        .title('Locations')
        .icon(BsGeoAlt)
        .child(S.documentTypeList('location').title('Locations')),
      S.listItem()
        .title('Location Types')
        .icon(BsGeoFill)
        .child(S.documentTypeList('locationType').title('Location Types')),

      // Website Settings Section
      S.divider().title('Website Settings'),
      S.listItem()
        .title('Site Settings')
        .icon(BsGear)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
    ])
}

export default deskStructure 