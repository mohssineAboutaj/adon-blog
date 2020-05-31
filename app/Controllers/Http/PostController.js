"use strict";

const Post = use("App/Models/Post");
const isEmpty = require("is-empty");
const dateformat = require("dateformat");
const { validate } = use("Validator");

// global validation rules
const rules = {
	title: "required|min:3|max:100",
	content: "required|min:10"
};

class PostController {
	// index
	async index({ view }) {
		let posts = await Post.all();
		posts = posts.toJSON();

		return view.render("index", { posts });
	}

	// shot single post by id
	async show({ view, params }) {
		// fetch post by id
		let post = await Post.find(params.id);

		// modify something
		post.created_at = dateformat(post.created_at, "yyyy-mmmm-d HH:mm");
		post.updated_at = dateformat(post.updated_at, "yyyy-mmmm-d HH:mm");

		// return post to show
		return view.render("show", { post });
	}

	// create new post form
	async create({ view }) {
		return view.render("create");
	}

	// store the new post in DB
	async store({ request, response, session }) {
		const title = request.input("title");
		const content = request.input("content");

		// new instance from Post()
		const post = new Post();

		// create validation
		const validation = await validate(request.all(), rules);

		// check post fields to save or return errors
		if (!validation.fails()) {
			post.title = title;
			post.content = content;
			// save data
			post.save();
			// redirect after saving & show flash message
			session.flash({
				notif: "post created successfuly"
			});
			response.redirect("/");
		} else {
			session.withErrors(validation.messages()).flashAll();
			response.redirect("back");
		}
	}

	// edit an exist post
	async edit({ view, params }) {
		// fetch post by id
		let post = await Post.find(params.id);
		post = post.toJSON();

		// return post data
		return view.render("edit", { post });
	}

	// apply post editing
	async update({ request, response, params, session }) {
		const title = request.input("title");
		const content = request.input("content");

		// new instance from Post()
		const post = await Post.find(params.id);

		// create validation
		const validation = await validate(request.all(), rules);

		// check post fields to save or return errors
		if (!validation.fails()) {
			post.title = title;
			post.content = content;
			// save data
			post.save();
			// redirect after saving & show flash message
			session.flash({
				notif: "post updated successfuly"
			});
			response.redirect("/");
		} else {
			session.withErrors(validation.messages()).flashAll();
			response.redirect("back");
		}
	}

	// delete a post
	async delete({ response, params, session }) {
		const post = await Post.find(params.id);
		if (post.delete()) {
			session.flash({
				notif: "post deleted successfuly"
			});
			response.redirect("/");
		}
	}
}

module.exports = PostController;
