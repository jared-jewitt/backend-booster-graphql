import { ForbiddenError } from 'apollo-server';
import { DataSource } from 'apollo-datasource';

export default class PostAPI extends DataSource {
  constructor() {
    super();
  }

  initialize(config) {
    this.context = config.context;
  }

  async getPosts() {
    try {
      return await this.context.models.Post.find();
    } catch (e) {
      return e;
    }
  }
  
  async getPostById(postId) {
    try {
      return await this.context.models.Post.findById(postId);
    } catch (e) {
      return e;
    }
  }
  
  async createPost(message) {
    const newPost = new this.context.models.Post({
      message,
      user: this.context.user.id,
    });
  
    const res = await newPost.save();
    return {
      ...res._doc,
      id: res._id,
    };
  }
  
  async deletePost(postId) {
    try {
      const post = await this.context.models.Post.findById(postId);
      if (this.context.user.id === post.user.toString()) {
        await post.delete();
        return 'Post deleted successfully';
      } else {
        throw new ForbiddenError('You are not authorized to delete this post');
      }
    } catch (e) {
      return e;
    }
  }
}
