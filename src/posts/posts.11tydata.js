export default {
	tags: [
		"posts"
	],
	layout: "layouts/post.njk",
  permalink: "/{{ title | slugify or permalink | slugify }}/",
};
