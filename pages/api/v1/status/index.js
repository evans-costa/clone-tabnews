function status(request, response) {
  response.status(200).json({ status: "Endpoint status funcionando." });
}

export default status;
