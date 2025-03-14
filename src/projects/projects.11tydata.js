export default {
	tags: [
		"project-page"
	],
	"layout": "layouts/project.njk",
  permalink: "/{{ name | slugify or permalink | slugify }}/",
};
