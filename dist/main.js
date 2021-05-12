// console.log('hello its me');
const fetchData = async () => {
  const respond = await fetch(
    'http://localhost:8888/.netlify/functions/hello-world'
  );
  const data = await respond.json();
  console.log(data);
};
fetchData();
