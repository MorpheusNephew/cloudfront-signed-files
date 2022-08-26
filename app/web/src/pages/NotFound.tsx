import { useParams } from "react-router-dom";

export const NotFound = () => {
  const params = useParams();

  console.log({ pageNotFoundParams: params });
  return <>Page Not Found...</>;
};
