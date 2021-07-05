export default {
  widgets: [
    {
      name: 'sanity-tutorials',
      options: {
        templateRepoId: 'sanity-io/sanity-template-eleventy-blog'
      }
    },
    {name: 'structure-menu'},
    {
      name: 'project-info',
      options: {
        __experimental_before: [
          {
            name: 'netlify',
            options: {
              description:
                'NOTE: Because these sites are static builds, they need to be re-deployed to see the changes when documents are published.',
              sites: [
                {
                  buildHookId: '60e3201f26405e736c9a2d9e',
                  title: 'Sanity Studio',
                  name: 'atelierschork-studio',
                  apiId: '593f02c5-1684-43c0-91b1-8468de1f7651'
                },
                {
                  buildHookId: '60e3201fc966ae5e8a65c763',
                  title: 'Blog Website',
                  name: 'atelierschork',
                  apiId: '2573dd36-3d70-4d2c-894b-62ddad4fa1d6'
                }
              ]
            }
          }
        ],
        data: [
          {
            title: 'GitHub repo',
            value: 'https://github.com/mschork/atelierschork',
            category: 'Code'
          },
          {title: 'Frontend', value: 'https://atelierschork.netlify.app', category: 'apps'}
        ]
      }
    },
    {name: 'project-users', layout: {height: 'auto'}},
    {
      name: 'document-list',
      options: {title: 'Recent blog posts', order: '_createdAt desc', types: ['post']},
      layout: {width: 'medium'}
    }
  ]
}
