import { type GetServerSideProps } from 'next'
import { getServerAuthSession } from '../server/auth'
import Head from 'next/head'
import Image from 'next/image'

export default function Home() {
	return (
		<>
			<Head>
				<title>MimisChat</title>
			</Head>
			<main
				className="grid self-start"
				style={{
					gridTemplateColumns:
						'[full-start] max(1em, 5dvi) [content-start] 1fr 1fr [content-end] max(1em, 5dvi) [full-end]',
				}}
			>
				<section className="grid grid-rows-[auto] gap-4 bg-[hsl(238_98%_79%)] pli-4 [grid-column:_full] max-sm:grid-rows-[auto,_auto] sm:grid-cols-[subgrid]">
					<div className="sm:[grid-column-start:_content]">
						<Image
							src="/image-1.jpg"
							width={1_000}
							height={750}
							role="presentation"
							alt=""
						/>
					</div>

					<div className="self-center text-neutral-800 max-is-[75ch] plb-4 max-sm:row-start-1">
						<h2 className="text-3xl font-bold text-neutral-900 mbe-6">
							Bem-vindo ao MimisChat
						</h2>

						<p className="text-justify text-lg">
							Uma plataforma de comunicação à distância que permite que você
							converse com seus amigos e familiares através de mensagens de
							texto e chamadas de voz e vídeo.
						</p>
					</div>
				</section>

				<section className="grid grid-rows-[auto] gap-4 bg-[hsl(150_58%_48%)] pli-4 [grid-column:_full] max-sm:grid-rows-[auto,_auto] sm:grid-cols-[subgrid]">
					<div className="self-center text-neutral-800 max-is-[75ch] plb-4 max-sm:row-start-1 sm:[grid-column-start:_content]">
						<h2 className="text-3xl font-bold text-neutral-900 mbe-6">
							Converse com todos os seus amigos
						</h2>

						<p className="text-justify text-lg mbe-4">
							O MimisChat permite a criação de conversas individuais ou em grupo
							para que você e seus amigos possam estar sempre conectados.
						</p>

						<p className="text-justify text-lg">
							Após criar uma conversa você pode trocar mensagens de texto ou
							realizar chamadas de voz e vídeo.
						</p>
					</div>

					<div>
						<Image
							src="/image-2.jpg"
							width={1_000}
							height={1_000}
							role="presentation"
							alt=""
						/>
					</div>
				</section>
			</main>
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async ctx => {
	if (!ctx.locale) {
		return {
			redirect: { destination: '/pt-br/', permanent: false },
		}
	}

	const session = await getServerAuthSession(ctx)

	if (!session) return { props: { session: null } }

	return {
		redirect: {
			destination: `/${ctx.locale ?? 'pt-br'}/dashboard`,
			permanent: false,
		},
	}
}
