/**
 * MessageStatusIndicator Component
 *
 * Displays visual indicators for message delivery status in chat messages.
 * Shows different icons based on message status: sent, delivered, or read.
 *
 * Status Indicators:
 * - ✓ (Single check): Message sent but not delivered
 * - ✓✓ (Double check - gray): Message delivered but not read
 * - ✓✓ (Double check - blue): Message read by recipient
 *
 * Only displays for messages sent by the current user (isOwn = true)
 */

import { Check, CheckCheck } from "lucide-react";

/**
 * MessageStatusIndicator Component
 * @param {Object} props
 * @param {Object} props.status - Message status object with sent, delivered, read properties
 * @param {boolean} props.isOwn - Whether this is the current user's message
 * @returns {JSX.Element|null} Status indicator or null if not user's message
 */
const MessageStatusIndicator = ({ status, isOwn }) => {
	// Only show status for messages sent by current user
	if (!isOwn) return null;

	/**
	 * Determines which icon to display based on message status
	 * @returns {JSX.Element|null} Appropriate status icon or null
	 */
	const getStatusIcon = () => {
		// Message read (blue double check)
		if (status?.read) {
			return <CheckCheck className="w-4 h-4 text-blue-500" />;
		}
		// Message delivered (gray double check)
		else if (status?.delivered) {
			return <CheckCheck className="w-4 h-4 text-gray-400" />;
		}
		// Message sent (gray single check)
		else if (status?.sent) {
			return <Check className="w-4 h-4 text-gray-400" />;
		}
		// No status or unknown status
		return null;
	};

	return (
		<div className="flex items-center justify-end mt-1">
			{getStatusIcon()}
		</div>
	);
};

export default MessageStatusIndicator;
