export function LoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="container">
      <div className="loading-container">
        <div className="loading-spinner" aria-hidden="true" />
        <p className="loading-text">{text}</p>
      </div>
    </div>
  )
}
