import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllPosts, getPostsStatus, getPostsError, fetchPosts } from './postsSlice';
import PostsExcerpt from './PostsExcerpt';

const PostsList = () => {
    const dispatch = useDispatch();
    const effectRun = useRef(false);

    const posts = useSelector(selectAllPosts);
    const postsStatus = useSelector(getPostsStatus);
    const error = useSelector(getPostsError); 

    useEffect(() => {
        if (effectRun.current === false) {
            if (postsStatus === 'idle') {
                dispatch(fetchPosts());
            }
            return () => {
                effectRun.current = true;
            };
        }
    }, [postsStatus, dispatch]);

    let content;

    if (postsStatus === 'loading') {
        content = <p>"Loading..."</p>;
    }
    else if (postsStatus === 'succeeded') {
        const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date));
        content = orderedPosts.map((post, index) => {
            return (<PostsExcerpt key={post.id} post={post} />)
        })
    }
    else if (postsStatus === 'failed') {
        content = <p>{error}</p>
    }

    return (
        <section>
            <h2>Posts</h2>
            {content}
        </section>
    )
};

export default PostsList;