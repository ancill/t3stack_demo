import Error from 'next/error'
import { useRouter } from 'next/router'
import { trpc } from '../../utils/trpc'

function SinglePostPage() {
	const router = useRouter()


	const postId = router.query.postId as string

	const { data, isLoading } = trpc.useQuery(['posts.single-post', {
		postId
	}])

	if (isLoading) {
		return <p>Loading posts...</p>
	}

	if (!data) {
		return <Error statusCode={404} />
	}

	return (
		<div className="max-w-sm rounded overflow-hidden shadow-lg">
			<div className="px-6 py-4">
				<h1 className="font-bold text-xl mb-2"  >{data?.title}</h1>
				<div className="text-gray-700 text-base" >
					{data?.body}
				</div>
			</div>
		</div>
	)
}

export default SinglePostPage