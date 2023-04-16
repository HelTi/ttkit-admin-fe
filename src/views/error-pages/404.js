import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
	const navigate = useNavigate();
	const goHome = () => {
		navigate('/');
	};
	return (
		<Result
			status="404"
			title="404"
			subTitle="Sorry, the page you visited does not exist."
			extra={
				<Button type="primary" onClick={goHome}>
					返回首页
				</Button>
			}
		/>
	);
};

export default NotFound;
