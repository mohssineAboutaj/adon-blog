"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.get("/", "PostController.index");

Route.get("/post/:id", "PostController.show");

Route.get("/create", "PostController.create");
Route.post("/create", "PostController.store");

Route.get("/post/:id/edit", "PostController.edit");
Route.post("/post/:id/update", "PostController.update");

Route.get("/post/:id/delete", "PostController.delete");
