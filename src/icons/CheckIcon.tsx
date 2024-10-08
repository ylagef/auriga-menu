function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby="okIconTitle"
      stroke="#000000"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
      color="#000000"
      className={className}
    >
      <title id="okIconTitle">Ok</title> <polyline points="4 13 9 18 20 7" />
    </svg>
  )
}

export default CheckIcon
