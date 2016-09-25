#-*- coding: utf8 -*-
import MySQLdb
import time
db = MySQLdb.connect(host = "mysql88.1gb.ru", user = "gb_x_123ph03a", passwd = "32eb8237756", db = "gb_x_123ph03a", charset = 'utf8')
cursor = db.cursor()

fin = open('sitemap.xml','w')

sql = "SELECT special_date FROM special"
cursor.execute(sql)

special = cursor.fetchall()

fin.write("""<?xml version="1.0" encoding="UTF-8"?>\n""")
fin.write("""<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n""")
fin.write("""\t<url>\n""")
fin.write("\t\t<loc>\nhttp://" + u"физикапросто.рф".encode("utf8") + "/?_escaped_fragment_=home\n</loc>\n")
fin.write("\t\t<changefreq>" + "monthly" + "</changefreq>\n")
fin.write("\t\t<lastmod>" + special[0][0].strftime('%Y-%m-%dT%H:%M:%S+03:00') + "</lastmod>\n")
fin.write("\t\t<priority>" + "1" + "</priority>\n")
fin.write("""\t</url>\n""")
fin.write("""\t<url>\n""")
fin.write("\t\t<loc>\nhttp://" + u"физикапросто.рф".encode("utf8") + "/?_escaped_fragment_=help\n</loc>\n")
fin.write("\t\t<changefreq>" + "monthly" + "</changefreq>\n")
fin.write("\t\t<lastmod>" + special[1][0].strftime('%Y-%m-%dT%H:%M:%S+03:00') + "</lastmod>\n")
fin.write("\t\t<priority>" + "1" + "</priority>\n")
fin.write("""\t</url>\n""")


sql = "SELECT paragraph_id, paragraph_date FROM paragraph"
cursor.execute(sql)

paragraphs = cursor.fetchall()

for i in paragraphs:
	fin.write("""\t<url>\n""")
	fin.write("\t\t<loc>http://" + u"физикапросто.рф".encode("utf8") + "/?_escaped_fragment_=paragraphID" + str(i[0]) + "</loc>\n")
	fin.write("\t\t<lastmod>" + i[1].strftime('%Y-%m-%dT%H:%M:%S+03:00') + "</lastmod>\n")
	fin.write("\t\t<changefreq>" + "monthly" + "</changefreq>\n")
	fin.write("\t\t<priority>" + "1" + "</priority>\n")
	fin.write("""\t</url>\n""")

sql = "SELECT problem_id, problem_date FROM problem"
cursor.execute(sql)

paragraphs = cursor.fetchall()

for i in paragraphs:
	fin.write("""\t<url>\n""")
	fin.write("\t\t<loc>http://" + u"физикапросто.рф".encode("utf8") + "/?_escaped_fragment_=problemID" + str(i[0]) + "</loc>\n")
	fin.write("\t\t<lastmod>" + i[1].strftime('%Y-%m-%dT%H:%M:%S+03:00') + "</lastmod>\n")
	fin.write("\t\t<changefreq>" + "monthly" + "</changefreq>\n")
	fin.write("\t\t<priority>" + "1" + "</priority>\n")
	fin.write("""\t</url>\n""")

fin.write("""</urlset>""")