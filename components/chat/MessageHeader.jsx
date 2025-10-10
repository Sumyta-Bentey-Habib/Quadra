"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import AddPeopleModal from "./AddPeopleModal";
import { useSession } from "next-auth/react";
import TypingIndicator from "./TypingIndicator";
import { formatLastSeenTime } from "@/lib/timestamp";

const MessageHeader = ({ conversation }) => {
	const router = useRouter();
	const { data: session } = useSession();
	const [isTyping, setIsTyping] = useState(false);
	const [userStatus, setUserStatus] = useState(null);
	const [openAddPeople, setOpenAddPeople] = useState(false);

	const otherUser = conversation.participantDetails?.find((p) => p._id !== session?.user?.id);
	console.log(otherUser);
	console.log(conversation);

	useEffect(() => {
		if (!socket.connected) {
			socket.connect();
		}

		if (socket.connected && session?.user?.id && !socket.authenticated) {
			socket.emit("authenticate", session.user.id);
			socket.authenticated = true;
		}

		if (!otherUser) return;

		const handleUserStatusChanged = ({ userId, isOnline, lastSeen }) => {
			if (userId === otherUser._id) {
				setUserStatus({ isOnline, lastSeen });
			}
		};

		const handleUserTyping = ({ userId, isTyping }) => {
			if (userId === otherUser._id) {
				setIsTyping(isTyping);
			}
		};

		socket.on("userStatusChanged", handleUserStatusChanged);
		socket.on("userTyping", handleUserTyping);

		// Fetch initial user status
		const fetchUserStatus = async () => {
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/status/${otherUser._id}`);
				const data = await res.json();
				setUserStatus(data);
			} catch (error) {
				console.error("Failed to fetch user status:", error);
			}
		};

		fetchUserStatus();

		return () => {
			socket.off("userStatusChanged", handleUserStatusChanged);
			socket.off("userTyping", handleUserTyping);
		};
	}, [otherUser, session?.user?.id]);

	return (
		<>
			<header className='p-4 border-b bg-muted/50 flex items-center justify-between'>
				<div className="flex items-center gap-4">
					<div className='flex items-center gap-2'>
						<Button
							variant='outline'
							size='sm'
							className='sm:hidden'
							onClick={() => router.push("/messages")}
						>
							<ArrowLeft />
						</Button>
						<div className="relative">
							<Avatar className='ml-2'>
								<AvatarImage src={conversation.isGroup ? null : otherUser?.imageUrl} />
								<AvatarFallback>{conversation.isGroup ? conversation.groupName[0] : otherUser?.name[0]}</AvatarFallback>
							</Avatar>
							{!conversation.isGroup && (
								<div
									className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
										userStatus?.isOnline ? 'bg-green-500' : 'bg-red-500'
									}`}
								/>
							)}
						</div>
					</div>
					<div>
						<h2 className='font-semibold text-lg'>
							{conversation.isGroup ? conversation.groupName : otherUser?.name}
						</h2>
						<div className="text-sm text-muted-foreground">
							{conversation.isGroup ? (
								`${conversation.participants.length} members`
							) : (
								<>
									{isTyping ? (
										<TypingIndicator isTyping={isTyping} userName={otherUser?.name} />
									) : (
										<div className="flex items-center gap-2">
											<div className={`w-2 h-2 rounded-full ${userStatus?.isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
											<span>
												{userStatus?.isOnline
													? "Online"
													: userStatus?.lastSeen
													? formatLastSeenTime(userStatus.lastSeen)
													: "Offline"}
											</span>
										</div>
									)}
								</>
							)}
						</div>
					</div>
				</div>
				{conversation.isGroup && (
					<Button variant="outline" onClick={() => setOpenAddPeople(true)}>
						<UserPlus className="mr-2 h-4 w-4" />
						Add People
					</Button>
				)}
			</header>
			{openAddPeople && (
				<AddPeopleModal
					open={openAddPeople}
					setOpen={setOpenAddPeople}
					conversation={conversation}
				/>
			)}
		</>
	);
};

export default MessageHeader;
