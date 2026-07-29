import { format, parseISO, differenceInDays } from 'date-fns'

export const formatDate = (dateString, pattern = 'MMM dd, yyyy') => {
  if (!dateString) return '-'
  try {
    return format(parseISO(dateString), pattern)
  } catch {
    return dateString
  }
}

export const formatDateTime = (dateString) => {
  return formatDate(dateString, 'MMM dd, yyyy HH:mm')
}

export const timeAgo = (dateString) => {
  const days = differenceInDays(new Date(), parseISO(dateString))
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return formatDate(dateString)
}

export const getStatusColor = (status) => {
  const colors = {
    AVAILABLE: 'green',
    UNDER_MAINTENANCE: 'red',
    OUT_OF_SERVICE: 'red',
    RETIRED: 'slate',
    PENDING_APPROVAL: 'amber',
    CONFIRMED: 'green',
    IN_USE: 'blue',
    COMPLETED: 'green',
    CANCELLED: 'red',
    NO_SHOW: 'red',
  }
  return colors[status] || 'slate'
}

export const getInitials = (name) => {
  if (!name) return 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
