import Avatar from '../../../../../components/Avatar'
import Button from '../../../../../components/Button'

type UserListItemProps = {
	user: {
		id: string
		image: string
		name: string
		email: string
	}
	onClick: (id: string) => Promise<void>
}
export default function UserListItem({ user, onClick }: UserListItemProps) {
	return (
		<div className="em:p-1">
			<Button
				type="submit"
				className="text-neutral-900 shadow-none is-full dark:text-neutral-50 [&_>_div]:place-content-start"
				variant="flat"
				onClick={() => {
					void onClick(user.id)
				}}
			>
				<Avatar name={user.name} imageUrl={user.image} />
			</Button>
		</div>
	)
}
