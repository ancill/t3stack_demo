import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { CreatePostInput } from '../../schema/post.schema'
import { trpc } from '../../utils/trpc'
import Image from 'next/image'
import CardTopImage from '../../img/card-top.jpg'

function CreatePostPage() {
	const { handleSubmit, register } = useForm<CreatePostInput>()
	const router = useRouter()

	const { mutate, error } = trpc.useMutation(['posts.create-post'], {
		onSuccess: ({ id }) => {
			router.push(`/posts/${id}`)
		}
	})

	function onSubmit(values: CreatePostInput) {
		mutate(values)
	}

	return <form onSubmit={handleSubmit(onSubmit)}>
		{error && error.message}
		<div className="max-w-sm rounded overflow-hidden shadow-lg">
			<Image className="w-full" src={CardTopImage} alt="Sunset in the mountains" layout="responsive" />
			<div className="px-6 py-4">

				<input className="font-bold text-xl mb-2" type='text' placeholder='Your post title'
					{...register('title')} />
				<textarea className="text-gray-700 text-base" placeholder='Your post info' {...register('body')}>
				</textarea>

			</div>
			<div className="px-6 pt-4 pb-2">
				<button className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">Create post</button>
			</div>
		</div>
	</form>
}

export default CreatePostPage


