
export function parseOrder (props) {
  const itemRefs = Array.from(
    props.opfDoc.querySelectorAll('itemref:not([linear="no"])')
  )
  itemRefs.forEach((element, index) => {
    const item = props.attachment.filter(item => {
      return item.id === element.getAttribute('idref')
    })[0]
    item.activity['position'] = index
  })
  props.totalItems = itemRefs.length
  // Gets the creators (specific roles in later release)
  // Contributors are a future feature
  props.attributedTo = Array.from(props.opfDoc.querySelectorAll('creator')).map(
    creator => {
      return {
        type: 'Person',
        name: creator.textContent
      }
    }
  )
  return props
}
