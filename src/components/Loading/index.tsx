import './styles.scss';

type LoadingProps = {
  isLoading: boolean;
};

export function Loading({ isLoading }: LoadingProps) {
  return (
    <>
      {isLoading ? (
        <div className="loading">
          <h1>Loading...</h1>
        </div>
      ) : ""}
    </>
  );
}
