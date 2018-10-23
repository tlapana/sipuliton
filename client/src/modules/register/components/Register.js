class Register extends React.Component
{
	handleRegistration(event)
	{
		console.log('Registration sent');
	}
	render()
	{
		return (
		<h1>Rekisteröidy</h1>
		<form onSubmit={this.handleRegistration}>
		<label>
		Käyttäjätunnus:<br>
		<input type="text" name="username"/><br>
		Salasana:<br>
		<input type="password" name="pass"/><br>
		Salasana uudelleen:<br>
		<input type="password" name="retypepass"/><br>
		Sähköposti:<br>
		<input type="email" name="mail"/><br>
		Sähköposti uudelleen:<br>
		<input type="email" name="retypemail"/><br>
		<input type="radio" name="ula"/>Hyväksyn käyttäjäehdot<br>
		</label>
		<input type="submit"/>
		</form>
		)
	}
}