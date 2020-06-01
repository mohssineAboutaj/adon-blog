"use strict";

// adonis modules
const Post = use("App/Models/Post");
const { validate } = use("Validator");
const Helpers = use("Helpers");

// import / require dependencies
const dateformat = require("dateformat");
let uniqid = require("uniqid");

// global validation rules
const inputsRules = {
	title: "required|min:3|max:100",
	content: "required|min:10"
};
const imagesRules = {
	types: ["png", "jpg", "jpeg"],
	size: "4mb"
};

// uploads directory path
const uploadsDir = Helpers.publicPath("uploads/posts");

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
		const img = request.file("image", imagesRules);

		// new instance from Post()
		const post = new Post();

		// create validation
		const validation = await validate(request.all(), inputsRules);

		// upload image proccessing
		const imageNewName = `${dateformat(
			new Date(),
			"d-mmmm-yyyy"
		)}_${uniqid()}.${img.subtype}`;
		await img.move(uploadsDir, {
			name: imageNewName
		});

		// check post fields to save or return errors
		if (validation.fails()) {
			session.withErrors(validation.messages()).flashAll();
			response.redirect("back");
		} else if (!img.moved()) {
			session
				.withErrors([
					{
						field: "image",
						message: img.error().message
					}
				])
				.flashAll();
			response.redirect("back");
		} else {
			post.title = title;
			post.content = content;
			post.image = imageNewName;
			// save data
			post.save();
			// redirect after saving & show flash message
			session.flash({
				notif: "post created successfuly"
			});
			response.redirect("/");
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
		const postID = params.id;
		const title = request.input("title");
		const content = request.input("content");
		const img = request.file("image", imagesRules);

		// new instance from Post()
		const post = await Post.find(postID);

		// create validation
		const validation = await validate(request.all(), inputsRules);

		// upload image proccessing
		const imageNewName = `${dateformat(
			new Date(),
			"d-mmmm-yyyy"
		)}_${uniqid()}.${img.subtype}`;
		await img.move(uploadsDir, {
			name: imageNewName
		});

		// check post fields to save or return errors
		if (validation.fails()) {
			session.withErrors(validation.messages()).flashAll();
			response.redirect("back");
		} else if (!img.moved()) {
			session
				.withErrors([
					{
						field: "image",
						message: img.error().message
					}
				])
				.flashAll();
			response.redirect("back");
		} else {
			post.title = title;
			post.content = content;
			post.image = imageNewName;
			// save data
			post.save();
			// redirect after saving & show flash message
			session.flash({
				notif: "post updated successfuly"
			});
			response.redirect("/post/" + postID);
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
