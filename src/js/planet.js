const {
  name,
  desc,
  sector1,
  sector2,
  sector3,
  sector4,
  sector5,
  sector6,
} = {
  name: document.querySelector('#name'),
  desc: document.querySelector('#desc'),
  sector1: document.querySelector('#secteur1'),
  sector2: document.querySelector('#secteur2'),
  sector3: document.querySelector('#secteur3'),
  sector4: document.querySelector('#secteur4'),
  sector5: document.querySelector('#secteur5'),
  sector6: document.querySelector('#secteur6'),
};

const Button = document.querySelector('#validation');

const PlanetRequest = new Request(`/planet${new URL(document.URL).pathname}`);

fetch(PlanetRequest).then(res => res.json())
  .then((body) => {
    name.value = body.name;
    desc.value = body.desc || '';
    sector1.value = body.sector1 || '';
    sector2.value = body.sector2 || '';
    sector3.value = body.sector3 || '';
    sector4.value = body.sector4 || '';
    sector5.value = body.sector5 || '';
    sector6.value = body.sector6 || '';
  })
  .catch((err) => {
    console.error(err);
  });

Button.addEventListener('click', () => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const UpdateRequest = new Request(`/planet${new URL(document.URL).pathname}`, {
    method: 'PATCH',
    body: JSON.stringify({
      desc: desc.value,
      sector1: sector1.value,
      sector2: sector2.value,
      sector3: sector3.value,
      sector4: sector4.value,
      sector5: sector5.value,
      sector6: sector6.value,
    }),
    headers,
  });

  fetch(UpdateRequest).then(() => document.location.reload())
    .catch(err => console.error(err));
});
