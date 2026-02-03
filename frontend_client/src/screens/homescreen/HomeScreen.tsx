import { Helmet } from "react-helmet-async";
import Home from "../../components/home/Home";

function HomeScreen() {
  return (
    <div>
      <Helmet>
        <title>Crypto Tracker | HighLite Logistics</title>
      </Helmet>
      <div>
        <Home />
      </div>
    </div>
  );
}

export default HomeScreen;
