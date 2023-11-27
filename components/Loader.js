export default function Loader() {
    return (
        <div style={
            {
                display: 'flex',
                flexDirection: 'column',
                position: 'absolute',
                width: "100%",
                height: "100%",
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
            }
        }>
            <img src="https://cdn.shopify.com/s/files/1/0344/6469/files/cat-gif-loop-maru_grande.gif?v=1523984148" alt="loading" />
            <p style={{color:"white"}}>메모 꺼내는중...</p>
        </div>
    );
}
