import Link from 'next/link'
import { SinglePostInput } from '../../schema/post.schema'
import { trpc } from '../../utils/trpc'

function PostListingPage() {
	const { isLoading, data } = trpc.useQuery(['posts.posts'])
	const { error, mutate } = trpc.useMutation(['posts.delete-post'])

	if (isLoading) {
		return <p>Loading...</p>
	}

	function removePost(postId: SinglePostInput) {
		mutate(postId)
	}

	return <div className=''>
		{data?.map(post => {
			return <article className='max-w-sm rounded overflow-hidden shadow-lg my-5 px-6 py-4 font-bold text-cyan-500 border-b-4 border-indigo-500' key={post.id}>
				<p className="text-orange-300">{post.title}</p>
				<Link href={`/posts/${post.id}`}>Read post</Link>
				<button onClick={() => removePost(post?.id)}>Read post</button>
			</article>
		})}
	</div>
}

export default PostListingPage