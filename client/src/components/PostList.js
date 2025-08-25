import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/App.css'; // make sure CSS file path is correct

function PostList() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState('');
  const [tags, setTags] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  // Fetch all posts from backend
  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts');
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle create or update post
  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = {
      title,
      content,
      categories: categories.split(',').map((c) => c.trim()),
      tags: tags.split(',').map((t) => t.trim()),
    };

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/posts/${editId}`, postData);
        setEditId(null);
      } else {
        await axios.post('http://localhost:5000/api/posts', postData);
      }
      setTitle('');
      setContent('');
      setCategories('');
      setTags('');
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit post
  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setCategories(post.categories ? post.categories.join(', ') : '');
    setTags(post.tags ? post.tags.join(', ') : '');
    setEditId(post._id);
  };

  // Delete post
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <ReactQuill value={content} onChange={setContent} />
        <br />
        <input
          type="text"
          placeholder="Categories (comma separated)"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <br />
        <button type="submit">{editId ? 'Update Post' : 'Add Post'}</button>
      </form>

      <h2>Posts:</h2>
      {posts.map((post) => (
        <div className="post" key={post._id}>
          <h3>{post.title}</h3>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
          {post.categories && <p><strong>Categories:</strong> {post.categories.join(', ')}</p>}
          {post.tags && <p><strong>Tags:</strong> {post.tags.join(', ')}</p>}
          <small>{new Date(post.createdAt).toLocaleString()}</small>
          <br />
          <button onClick={() => handleEdit(post)}>Edit</button>
          <button onClick={() => handleDelete(post._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default PostList;
