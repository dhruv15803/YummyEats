import {Oval} from 'react-loader-spinner'

type LoaderProps = {
    height:string;
    width:string;
    color:string;
}

const Loader = ({height,width,color}:LoaderProps) => {
  return (
    <>
      <Oval
        visible={true}
        height={height}
        width={width}
        color={color}
        secondaryColor="white"
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </>
  );
};

export default Loader;
