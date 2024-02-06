const GameOver = ({ onRetryClick }: { onRetryClick: () => void }) => {
    return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <p>you're dead</p>
            <button onClick={onRetryClick}>retry</button>
        </div>
    );
};

export default GameOver;
