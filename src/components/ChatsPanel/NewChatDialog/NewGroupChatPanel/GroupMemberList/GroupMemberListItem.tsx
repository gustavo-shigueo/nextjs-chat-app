import Avatar from '../../../../../components/Avatar'
import CheckBox from '../../../../../components/CheckBox'

type GroupMemberListItemProps = {
	checked: boolean
	contact: {
		id: string
		image: string
		name: string
		email: string
	}
	onChange: () => void
}

export default function GroupMemberListItem({
	contact,
	...props
}: GroupMemberListItemProps) {
	return (
		<div className="em:py-1">
			<CheckBox name={contact.id} {...props}>
				<Avatar imageUrl={contact.image} name={contact.name} />
			</CheckBox>
		</div>
	)
}
