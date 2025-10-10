/**
 * TypingIndicator Component
 *
 * Displays an animated typing indicator when another user is typing in the chat.
 * Shows bouncing dots animation with customizable user name.
 *
 * Features:
 * - Animated bouncing dots with staggered timing
 * - Customizable user name display
 * - Only renders when isTyping is true
 * - Consistent styling with the chat interface
 */

import React from 'react';

/**
 * TypingIndicator Component - Shows animated typing animation
 * @param {Object} props
 * @param {boolean} props.isTyping - Whether to show the typing indicator
 * @param {string} props.userName - Name of the user who is typing
 * @returns {JSX.Element|null} Typing indicator or null if not typing
 */
const TypingIndicator = ({ isTyping, userName }) => {
	// Don't render anything if user is not typing
	if (!isTyping) return null;

	return (
		<div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
			{/* Animated bouncing dots */}
			<div className="flex space-x-1">
				{/* Dot 1 - no delay */}
				<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
				{/* Dot 2 - 0.1s delay */}
				<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
				{/* Dot 3 - 0.2s delay */}
				<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
			</div>
			{/* Typing message with user name */}
			<span>{userName || "Someone"} is typing...</span>
		</div>
	);
};

export default TypingIndicator;
