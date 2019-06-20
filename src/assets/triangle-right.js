import React from 'react'
export default function (props) {
  return (
    <svg  xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <path fill={props.color||"#4d4d4d"}
            d="M11.086 22.086l2.829 2.829 8.914-8.914-8.914-8.914-2.828 2.828 6.086 6.086z"/>
    </svg>
  )
}