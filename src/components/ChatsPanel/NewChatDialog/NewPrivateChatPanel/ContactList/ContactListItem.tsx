import Avatar from '../../../../../components/Avatar'
import Button from '../../../../../components/Button'

type ContactListItemProps = {
	contact: {
		id: string
		image: string
		name: string
		email: string
	}
	onClick: (contactId: string) => Promise<void>
}

export default function ContactListItem({
	contact: { id, name, image },
	onClick,
}: ContactListItemProps) {
	return (
		<div className="em:p-1">
			<Button
				type="submit"
				className="text-neutral-900 shadow-none is-full dark:text-neutral-50 [&_>_div]:place-content-start"
				variant="flat"
				onClick={() => {
					void onClick(id)
				}}
			>
				<Avatar name={name} imageUrl={image} />
			</Button>
		</div>
	)
}
