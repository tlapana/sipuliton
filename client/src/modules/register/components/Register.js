class Register extends React.Component
{
	render()
	{
		return (
		<h1>Rekister�idy</h1>
		<form>
		<label>
		K�ytt�j�tunnus:<br>
		<input type="text" name="username"/><br>
		Salasana:<br>
		<input type="password" name="pass"/><br>
		Salasana uudelleen:<br>
		<input type="password" name="retypepass"/><br>
		S�hk�posti:<br>
		<input type="email" name="mail"/><br>
		S�hk�posti uudelleen:<br>
		<input type="email" name="retypemail"/><br>
		<input type="radio" name="ula"/>Hyv�ksyn k�ytt�j�ehdot<br>
		</label>
		<input type="submit"/>
		</form>
		)
	}
}