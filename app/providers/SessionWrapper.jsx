"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { socket } from "@/lib/socket";

const SessionWrapper = ({ children }) => {
	return (
		<SessionProvider>
			<SocketHandler />
			{children}
		</SessionProvider>
	);
};

const SocketHandler = () => {
	const { data: session } = useSession();

	useEffect(() => {
		if (session?.user?.id) {
			console.log("Connecting to socket and emitting userOnline event");
			socket.connect();
			socket.emit("userOnline", session.user.id);
		}

		return () => {
			if (session?.user?.id) {
				console.log("Disconnecting from socket");
				socket.disconnect();
			}
		};
	}, [session]);

	return null;
};

export default SessionWrapper;
