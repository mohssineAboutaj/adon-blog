"use strict";

const Post = use("App/Models/Post");

class PostController {
	async index({ view }) {
		let posts = await Post.all();
		posts = posts.toJSON();

		return view.render("index", { posts });
	}

	async show({ view, params }) {
		const post = await Post.find(params.id);
		return view.render("show", { post });
	}

	async create({ view }) {
		return view.render("create");
	}

	async store({ request }) {
		const title = request.input("title");
		const content = request.input("content");

		return { title, content };
	}

	async update({ view }) {
		return view.render("update");
	}

	async delete({ view }) {
		return view.render("delete");
	}
}

module.exports = PostController;
