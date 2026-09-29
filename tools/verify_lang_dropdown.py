import re
ok = True
for f in ["js/site.js", "js/app.js", "js/metals.js", "js/forex.js"]:
    src = open(f, encoding="utf-8").read()
    tiene_setlang = re.search(r"function setLang\(lang\)\s*\{", src) is not None
    arrow_malo = re.search(r"initLangDropdown\(\(\)\s*=>", src) is not None
    if f == "js/site.js":
        # site.js llama sin argumento porque su initLangDropdown invoca setLang
        # directamente en el manejador de clic.
        llama = re.search(r"initLangDropdown\(\)\s*;", src) is not None
        invoca_directo = re.search(r"setLang\(opt\.dataset\.lang\)", src) is not None
        bien = llama and invoca_directo
        detalle = "sin argumento + setLang directo"
    else:
        llama = re.search(r"initLangDropdown\(setLang\)\s*;", src) is not None
        usa_pick = re.search(r"pick\(opt\.dataset\.lang\)", src) is not None
        bien = llama and usa_pick
        detalle = "pasa setLang -> pick(...)"
    estado = "OK" if (tiene_setlang and bien and not arrow_malo) else "FALLO"
    if estado == "FALLO": ok = False
    print(f"{f:<14} {detalle:<28} arrow_malo={arrow_malo}  -> {estado}")
print()
print("CADENA COMPLETA CORRECTA" if ok else "HAY ALGUN FALLO")
