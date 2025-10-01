export function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Orasync logo"
        role="img"
        className="text-primary"
      >
        <path
          d="M16 2C12.5 2 9.5 4.5 9.5 8.5C9.5 12.5 12.5 15 16 15C19.5 15 22.5 12.5 22.5 8.5C22.5 4.5 19.5 2 16 2Z"
          fill="currentColor"
        />
        <path
          d="M16 15C12.5 15 9.5 17.5 9.5 21.5C9.5 25.5 12.5 28 16 28C19.5 28 22.5 25.5 22.5 21.5C22.5 17.5 19.5 15 16 15Z"
          fill="currentColor"
          opacity="0.7"
        />
        <circle cx="13" cy="10" r="1.5" fill="white" />
        <circle cx="19" cy="10" r="1.5" fill="white" />
      </svg>
      <span className="text-xl font-bold text-foreground">Orasync</span>
    </div>
  )
}
