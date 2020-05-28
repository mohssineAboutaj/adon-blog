"use strict";

const Post = use("App/Models/Post");
const isEmpty = require("is-empty");
const dateformat = require("dateformat");

class PostController {
	async index({ view }) {
		let posts = await Post.all();
		posts = posts.toJSON();

		return view.render("index", { posts });
	}

	async show({ view, params }) {
		// fetch post by id
		let post = await Post.find(params.id);

		// modify something
		post.created_at = dateformat(post.created_at, "yyyy-mmmm-d HH:mm");
		post.updated_at = dateformat(post.updated_at, "yyyy-mmmm-d HH:mm");

		// return post to show
		return view.render("show", { post });
	}

	async create({ view }) {
		return view.render("create");
	}

	async store({ request, response }) {
		const title = request.input("title");
		const content = request.input("content");

		// new instance from Post()
		const post = new Post();

		if (title && content) {
			// fill the obj
			post.title = title;
			post.content = content;

			// save data
			post.save();

			// redirect after saving
			response.redirect("/");
		} else {
			if (isEmpty(title)) {
				return "title is required";
			}
			if (isEmpty(content)) {
				return "content is required";
			}
		}
	}

	async edit({ view, params }) {
		// fetch post by id
		let post = await Post.find(params.id);
		post = post.toJSON();

		// return post data
		return view.render("edit", { post });
	}

	async update({ request, response, params }) {
		const title = request.input("title");
		const content = request.input("content");

		// new instance from Post()
		const post = await Post.find(params.id);

		if (title && content) {
			// fill the obj
			post.title = title;
			post.content = content;

			// save data
			post.save();

			// redirect after saving
			response.redirect("/");
		} else {
			if (isEmpty(title)) {
				return "title is required";
			}
			if (isEmpty(content)) {
				return "content is required";
			}
		}
	}

	async delete({ view }) {
		return view.render("delete");
	}
}

module.exports = PostController;
