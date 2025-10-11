/**
 * Utility functions for formatting timestamps in the messaging system
 * Provides human-readable relative time formatting for better UX
 */

/**
 * Formats message timestamp with relative time (e.g., "2m ago", "3h ago")
 * Used in message lists and conversation previews
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted time string
 */
export function formatMessageTime(date) {
  if (!date) return '';

  const now = new Date();
  const messageDate = new Date(date);
  const diffInSeconds = Math.floor((now - messageDate) / 1000);

  // Less than 1 minute - show "now"
  if (diffInSeconds < 60) {
    return 'now';
  }

  // Less than 1 hour - show minutes
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  }

  // Less than 24 hours - show hours
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  }

  // Less than 7 days - show days
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  }

  // More than 7 days - show full date and time
  return messageDate.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Formats last seen timestamp for user status display
 * Used in user status indicators and profile information
 * @param {Date|string} date - The last seen date
 * @returns {string} Formatted last seen string
 */
export function formatLastSeenTime(date) {
  if (!date) return 'Never';

  const now = new Date();
  const lastSeenDate = new Date(date);
  const diffInSeconds = Math.floor((now - lastSeenDate) / 1000);

  // Less than 1 minute - show "Just now"
  if (diffInSeconds < 60) {
    return 'Just now';
  }

  // Less than 1 hour - show minutes with "Last seen" prefix
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `Last seen ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }

  // Less than 24 hours - show hours with "Last seen" prefix
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `Last seen ${hours} hour${hours > 1 ? 's' : ''} ago`;
  }

  // More than 24 hours - show full date and time with "Last seen" prefix
  return `Last seen ${lastSeenDate.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`;
}
