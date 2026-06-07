import Menu from "../components/Menu";
import { useGetMeQuery } from "../state/authApiSlice";

const Layout = ({ children }: { children: React.ReactNode }) => {
  useGetMeQuery(undefined, { refetchOnMountOrArgChange: true });

  return (
    <>
      <Menu />
      <div className="ui-container-main">{children}</div>
    </>
  );
};

export default Layout;