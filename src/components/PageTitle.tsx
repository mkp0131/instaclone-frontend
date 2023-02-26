import { Helmet } from "react-helmet-async";

interface IProps {
  title: string;
}

const PageTitle = ({ title }: IProps) => {
  return (
    <>
      <Helmet>
        <title>{title} | instaclone</title>
      </Helmet>
    </>
  );
};

export default PageTitle;
