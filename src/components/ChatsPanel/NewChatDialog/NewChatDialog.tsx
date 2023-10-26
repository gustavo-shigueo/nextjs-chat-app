import { forwardRef } from 'react'
import { IoChatbox } from 'react-icons/io5'
import { MdGroups } from 'react-icons/md'
import { RiContactsBookFill } from 'react-icons/ri'
import Dialog from '../../../components/Dialog'
import Portal from '../../../components/Portal'
import { Tab, TabList, TabPanel, Tabs } from '../../../components/Tabs'
import AddContactPanel from './AddContactPanel'
import NewGroupChatPanel from './NewGroupChatPanel'
import NewPrivateChatPanel from './NewPrivateChatPanel'

const NewChatDialog = forwardRef<HTMLDialogElement>((_, ref) => {
	return (
		<Portal>
			<Dialog className="grid grid-rows-[auto_1fr] max-is-[60ch]" ref={ref}>
				<Tabs className="overflow-y-auto">
					<TabList>
						<Tab index={0}>
							<div className="flex items-center gap-1 text-xl plb-2">
								<IoChatbox className="mli-auto" />
								<p className="text-xs">Conversa Privada</p>
							</div>
						</Tab>
						<Tab index={1}>
							<div className="flex items-center gap-1 text-xl plb-2">
								<MdGroups className="mli-auto" />
								<p className="text-xs">Novo Grupo</p>
							</div>
						</Tab>
						<Tab index={2} active>
							<div className="flex items-center gap-1 text-xl plb-2">
								<RiContactsBookFill className="mli-auto" />
								<p className="text-xs">Adicionar Contato</p>
							</div>
						</Tab>
					</TabList>

					<TabPanel index={0} className="overflow-auto">
						<NewPrivateChatPanel />
					</TabPanel>
					<TabPanel index={1}>
						<NewGroupChatPanel />
					</TabPanel>
					<TabPanel index={2} className="overflow-hidden">
						<AddContactPanel />
					</TabPanel>
				</Tabs>
			</Dialog>
		</Portal>
	)
})

NewChatDialog.displayName = 'NewChatDialog'

export default NewChatDialog
